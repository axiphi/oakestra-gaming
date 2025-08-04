export interface InstancePorts {
  api: number;
  http: number;
  https: number;
  control: number;
  rtsp: number;
  video: number;
  audio: number;
}

export function createOakestraEnvFromInstancePorts(
  ports: InstancePorts,
): string[] {
  return [
    `WOLF_API_PORT=${ports.api}`,
    `WOLF_HTTP_PORT=${ports.http}`,
    `WOLF_HTTPS_PORT=${ports.https}`,
    `WOLF_CONTROL_PORT=${ports.control}`,
    `WOLF_RTSP_SETUP_PORT=${ports.rtsp}`,
    `WOLF_VIDEO_PING_PORT=${ports.video}`,
    `WOLF_AUDIO_PING_PORT=${ports.audio}`,
  ];
}

// This is the set of InstancePorts we can pick from when creating an instance.
// With the currently hard-coded port range we can deploy max. 68 instances per Oakestra setup.
export const allInstancePorts: InstancePorts[] = (function () {
  // 36002-(incl. 36410) is an unassigned port range we can use
  const startPortIncl = 36002;
  const endPortExcl = 36411;
  const result: InstancePorts[] = [];
  for (let port = startPortIncl; port + 7 <= endPortExcl; port += 7) {
    result.push({
      api: port,
      http: port + 1,
      https: port + 2,
      control: port + 3,
      rtsp: port + 4,
      video: port + 5,
      audio: port + 6,
    });
  }
  return result;
})();

export function createOakestraPortsFromInstancePorts(
  ports: InstancePorts,
): string {
  return `${ports.api}/tcp;${ports.https}/tcp;${ports.http}/tcp;${ports.control}/udp;${ports.rtsp}/tcp;${ports.video}/udp;${ports.audio}/udp`;
}

export function parseInstancePortsFromOakestraEnv(
  env: string[],
): InstancePorts | undefined {
  let api: number | undefined = undefined;
  let http: number | undefined = undefined;
  let https: number | undefined = undefined;
  let control: number | undefined = undefined;
  let rtsp: number | undefined = undefined;
  let video: number | undefined = undefined;
  let audio: number | undefined = undefined;

  for (const envVar of env) {
    const splitVar = envVar.split("=");
    if (splitVar.length < 2) {
      continue;
    }

    const key = splitVar[0];
    const value = parseInt(splitVar.slice(1).join(""));
    if (isNaN(value) || value <= 0) {
      continue;
    }

    switch (key) {
      case "WOLF_API_PORT": {
        api = value;
        break;
      }
      case "WOLF_HTTP_PORT": {
        http = value;
        break;
      }
      case "WOLF_HTTPS_PORT": {
        https = value;
        break;
      }
      case "WOLF_CONTROL_PORT": {
        control = value;
        break;
      }
      case "WOLF_RTSP_SETUP_PORT": {
        rtsp = value;
        break;
      }
      case "WOLF_VIDEO_PING_PORT": {
        video = value;
        break;
      }
      case "WOLF_AUDIO_PING_PORT": {
        audio = value;
        break;
      }
    }
  }

  if (
    api === undefined ||
    http === undefined ||
    https === undefined ||
    control === undefined ||
    rtsp === undefined ||
    video === undefined ||
    audio === undefined
  ) {
    return undefined;
  }

  return {
    api,
    http,
    https,
    control,
    rtsp,
    video,
    audio,
  };
}
