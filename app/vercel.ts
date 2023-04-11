export type Deployment = {
  projectId: string;
};

export async function getDeploymentByIdOrUrl(idOrUrl: string): Promise<Deployment> {
  return fetch(`https://api.vercel.com/v1/now/deployments/get?url=${encodeURIComponent(idOrUrl)}`, {
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
    },
    next: {
      revalidate: false,
    },
  }).then(res => res.json());
}
