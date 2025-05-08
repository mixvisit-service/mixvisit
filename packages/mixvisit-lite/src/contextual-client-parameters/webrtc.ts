type IceServerParam = {
  iceServer: string;
};

type IPsResult = {
  public: string[];
  private: string[];
  allRes: string[];
  log: string;
};

export async function getWebrtcIPs(
  param: IceServerParam = { iceServer: 'stun.l.google.com:19302' },
  timeoutMs: number = 4000
): Promise<IPsResult> {
  const ips = new Set<string>();
  const servers = { iceServers: [{ urls: `stun:${param.iceServer}` }] };
  const pc = new RTCPeerConnection(servers);

  try {
    pc.createDataChannel('');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        resolve();
      }, timeoutMs);

      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') {
          clearTimeout(timeout);
          resolve();
        }
      };
    });

    const sdp = pc.localDescription?.sdp || '';
    const ipMatches = [...sdp.matchAll(/(?:c=IN IP4|c=IN IP6) ([\d.a-fA-F:]+)/g)];

    for (const match of ipMatches) {
      const ip = match[1];
      if (ip && !ips.has(ip)) {
        ips.add(ip);
      }
    }

    const result: IPsResult = {
      public: [],
      private: [],
      allRes: Array.from(ips),
      log: sdp,
    };

    for (const ip of ips) {
      if (isPrivateIP(ip)) {
        result.private.push(ip);
      } else if (!ip.endsWith('.local')) {
        result.public.push(ip);
      }
    }

    return result;
  } catch (error) {
    throw error;
  } finally {
    pc.close();
  }
}

function isPrivateIP(ip: string): boolean {
  return [
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/,
    /^192\.168\.\d{1,3}\.\d{1,3}$/,
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  ].some((regex) => regex.test(ip));
}
