import { getImageUrl } from "./image";
import { Space, SpaceTypeKey } from "@/types";

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZXxlbnwwfHx8fDE3ODk1NTcxMDZ8MA&ixlib=rb-4.1.0&q=85";

export const SPACE_TYPE_IMAGE: Record<SpaceTypeKey, string> = {
  desk: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkZXNrfGVufDB8fHx8MTc4OTU1NzEwNnww&ixlib=rb-4.1.0&q=85",
  meeting_room: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwzfHxtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3ODk1NTcxMDZ8MA&ixlib=rb-4.1.0&q=85",
  private_office: "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwb2ZmaWNlfGVufDB8fHx8MTc4OTU1NzExMnww&ixlib=rb-4.1.0&q=85",
};

export function spaceImage(space?: Pick<Space, "foto" | "foto_url" | "tipe">): string {
  const resolved = getImageUrl(space?.foto_url, space?.foto, "");
  if (resolved) return resolved;
  return SPACE_TYPE_IMAGE[(space?.tipe as SpaceTypeKey) || "desk"] || SPACE_TYPE_IMAGE.desk;
}
