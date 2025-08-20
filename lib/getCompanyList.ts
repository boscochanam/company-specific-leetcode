interface GitHubContent {
  name: string;
  type: string;
}

export async function getCompanyList(): Promise<string[]> {
  const url = "https://api.github.com/repos/liquidslr/leetcode-company-wise-problems/contents/";
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'company-leetcode-app'
    },
    next: { revalidate: 86400 }
  });
  if (!res.ok) return [];
  const data: GitHubContent[] = await res.json();
  return data.filter((item: GitHubContent) => item.type === 'dir').map((item: GitHubContent) => item.name);
}
