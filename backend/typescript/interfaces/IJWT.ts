export interface IJWT {
  os: { hostName: string; platform: string; ip: string };
  id: string;
  remember: boolean;
  exp: number;
}
