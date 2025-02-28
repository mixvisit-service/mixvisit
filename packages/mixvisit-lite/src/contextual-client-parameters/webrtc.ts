type IceServerParam = {
  iceServer: string;
};

export type IPs = {
  public: string[];
  private: string[];
  allRes: string[];
  log: string;
};

export async function getWebRTC(
  param: IceServerParam = { iceServer: 'stun.l.google.com:19302' },
): Promise<IPs> {
  return new Promise((resolve, reject) => {
    const ips: string[] = [];
    const servers = { iceServers: [{ urls: `stun:${param.iceServer}` }] };
    const pc = new RTCPeerConnection(servers);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const { candidate } = event.candidate;
        const ipMatch = /candidate:\d+ \d+ udp \d+ (.+) \d+ typ (\w+)/.exec(candidate);

        if (Array.isArray(ipMatch) && ipMatch.length && !ips.includes(ipMatch[1])) {
          ips.push(ipMatch[1]);
        }
      } else {
        const ipResult: IPs = {
          public: [],
          private: [],
          allRes: ips,
          log: pc.localDescription?.sdp || '',
        };

        ips.forEach((ip) => {
          if (isPrivateIP(ip)) {
            ipResult.private.push(ip);
          } else if (!ip.endsWith('.local')) {
            ipResult.public.push(ip);
          }
        });
        resolve(ipResult);
        pc.close();
      }
    };

    pc.onicecandidateerror = (error) => {
      reject(error);
      pc.close();
    };

    pc.createDataChannel('');
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(reject);
  });
}

function isPrivateIP(ip: string): boolean {
  return [
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/,
    /^192\.168\.\d{1,3}\.\d{1,3}$/,
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  ].some((regex) => regex.test(ip));
}
