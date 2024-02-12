import { GitcoinStampItem, StampMetadata, StampOutput } from "./types"

export function mapStampsToPlatforms(stamps: GitcoinStampItem[]): StampOutput {
  const metadata: StampMetadata[] = stamps.map(
    (stamp: GitcoinStampItem) => stamp.metadata,
  );
  
  const connectedServices: StampOutput = {};
    for (const item of metadata) {
      if (item) {
        if (!connectedServices[item.platform.id]) {
          connectedServices[item.platform.id] = {
            [item.group]: {
              stamps: [item.description],
            },
          };
        } else if (connectedServices[item.platform.id][item.group]) {
          connectedServices[item.platform.id][item.group]?.stamps.push(
            item.description,
          );
        } else {
          connectedServices[item.platform.id][item.group] = {
            stamps: [item.description],
          };
        }
      }
    }

    return connectedServices;
}