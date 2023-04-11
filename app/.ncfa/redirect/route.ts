import { getDeploymentByIdOrUrl } from '../../vercel';
import type { NextRequest } from 'next/server';

function getValidProjectId() {
  return getProjectId(process.env.NEXT_PUBLIC_NCFA_DOMAIN!);
}

async function getProjectId(domain: string) {
  const { projectId } = await getDeploymentByIdOrUrl(domain);
  return projectId;
}

async function allowed(target: string) {
  if (target.includes('localhost')) {
    return false;
  }

  if (await getValidProjectId() === await getProjectId(target)) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const target = searchParams.get('target');
  if (!target || !await allowed(target)) {
    return new Response('target not allowed', { status: 400 });
  }

  const path = searchParams.get('path');
  const token = request.cookies.get('CF_Authorization')?.value;
  if (!path || !token) {
    return new Response('invalid request', { status: 400 });
  }

  const url = new URL(`https://${target}/.ncfa/authorize`);
  url.searchParams.set('path', path);
  url.searchParams.set('token', token);
  return Response.redirect(url);
}
