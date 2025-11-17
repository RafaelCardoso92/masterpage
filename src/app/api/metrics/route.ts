import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const METRICS_FILE = path.join(process.cwd(), 'src/data/metrics.json');

interface Visit {
  id: string;
  timestamp: string;
  visitorHash: string;
  page: string;
  referrer: string;
  userAgent: string;
  country?: string;
  city?: string;
  ip?: string;
  screenResolution?: string;
  language?: string;
}

interface MetricsData {
  visits: Visit[];
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    lastUpdated: string | null;
  };
}

// Helper to get client IP
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

// Helper to hash IP for privacy
function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'salt-secret-key').digest('hex').substring(0, 16);
}

// Helper to get geolocation from IP
async function getGeolocation(ip: string): Promise<{ country?: string; city?: string }> {
  // Skip for local/unknown IPs
  if (ip === 'unknown' || ip.startsWith('192.168.') || ip.startsWith('127.') || ip.startsWith('10.')) {
    return { country: 'Local', city: 'Local' };
  }

  try {
    // Using ip-api.com free tier (no API key needed, 45 req/min limit)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        return {
          country: data.country || 'Unknown',
          city: data.city || 'Unknown',
        };
      }
    }
  } catch (error) {
    console.error('Geolocation error:', error);
  }

  return { country: 'Unknown', city: 'Unknown' };
}

// POST /api/metrics - Log a visit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, screenResolution, language } = body;

    // Get client info
    const ip = getClientIp(request);
    const visitorHash = hashIp(ip);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Get geolocation
    const { country, city } = await getGeolocation(ip);

    // Read existing metrics
    const data = await fs.readFile(METRICS_FILE, 'utf-8');
    const metrics: MetricsData = JSON.parse(data);

    // Create new visit
    const visit: Visit = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      visitorHash,
      page,
      referrer: referrer || 'Direct',
      userAgent,
      country,
      city,
      screenResolution,
      language,
    };

    // Add to visits array
    metrics.visits.push(visit);

    // Update summary
    metrics.summary.totalVisits = metrics.visits.length;

    // Count unique visitors
    const uniqueVisitors = new Set(metrics.visits.map(v => v.visitorHash));
    metrics.summary.uniqueVisitors = uniqueVisitors.size;

    metrics.summary.lastUpdated = new Date().toISOString();

    // Write back to file
    await fs.writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging visit:', error);
    return NextResponse.json({
      error: 'Failed to log visit',
      details: error.message
    }, { status: 500 });
  }
}

// GET /api/metrics - Get all metrics (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read metrics
    const data = await fs.readFile(METRICS_FILE, 'utf-8');
    const metrics: MetricsData = JSON.parse(data);

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period'); // 'today', 'week', 'month', 'all'
    const page = searchParams.get('page');

    let filteredVisits = [...metrics.visits];

    // Filter by time period
    if (period && period !== 'all') {
      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      filteredVisits = filteredVisits.filter(v => new Date(v.timestamp) >= startDate);
    }

    // Filter by page
    if (page) {
      filteredVisits = filteredVisits.filter(v => v.page === page);
    }

    // Calculate analytics
    const analytics = {
      summary: {
        totalVisits: filteredVisits.length,
        uniqueVisitors: new Set(filteredVisits.map(v => v.visitorHash)).size,
        lastUpdated: metrics.summary.lastUpdated,
      },
      byPage: {} as Record<string, number>,
      byCountry: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      byReferrer: {} as Record<string, number>,
      byHour: Array(24).fill(0),
      byDay: Array(7).fill(0),
      recentVisits: filteredVisits.slice(-100).reverse(),
    };

    // Aggregate data
    filteredVisits.forEach(visit => {
      // By page
      analytics.byPage[visit.page] = (analytics.byPage[visit.page] || 0) + 1;

      // By country
      if (visit.country) {
        analytics.byCountry[visit.country] = (analytics.byCountry[visit.country] || 0) + 1;
      }

      // By city
      if (visit.city) {
        analytics.byCity[visit.city] = (analytics.byCity[visit.city] || 0) + 1;
      }

      // By referrer
      analytics.byReferrer[visit.referrer] = (analytics.byReferrer[visit.referrer] || 0) + 1;

      // By hour
      const hour = new Date(visit.timestamp).getHours();
      analytics.byHour[hour]++;

      // By day of week (0 = Sunday)
      const day = new Date(visit.timestamp).getDay();
      analytics.byDay[day]++;
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

// DELETE /api/metrics - Clear all metrics (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check admin session
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value.length !== 64) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset metrics
    const metrics: MetricsData = {
      visits: [],
      summary: {
        totalVisits: 0,
        uniqueVisitors: 0,
        lastUpdated: new Date().toISOString(),
      },
    };

    await fs.writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing metrics:', error);
    return NextResponse.json({ error: 'Failed to clear metrics' }, { status: 500 });
  }
}
