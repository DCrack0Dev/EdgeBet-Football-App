import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    vercel: {
      gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
      env: process.env.VERCEL_ENV || null,
      url: process.env.VERCEL_URL || null,
    },
    nodeEnv: process.env.NODE_ENV || null,
    nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  })
}

