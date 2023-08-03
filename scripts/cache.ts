import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export type Options = {
  useDefaultBackground: boolean;
  showBanner: boolean;
};

export type Artwork = {
  title: string;
  description: string;
  artist: string;
  date: string;
  image: string;
  drop: string;
};

const notion = new Client({
  auth: process.env.NOTION,
});

const fetchOptions = (await notion.databases.query({
  database_id: "84570cdcc58b4a6b9921ebd45bb067ba",
})) as any;

const options: Options = {
  useDefaultBackground: fetchOptions.results[0].properties.Value.checkbox,
  showBanner: fetchOptions.results[1].properties.Value.checkbox,
};

const artwork: Artwork[] = [];

const fetchArtwork = await notion.databases.query({
  database_id: "ff0dcfa8c3354c6c9f9bd9481fca40bc",
});

for (const { properties } of fetchArtwork.results as any) {
  const { Title, Artist, Description, Date, Drop, Image } = properties;

  artwork.push({
    title: Title.title[0].plain_text,
    artist: Artist.select.name,
    description: Description.rich_text[0].plain_text,
    date: Date.date.start,
    drop: Drop.url,
    image: Image.url,
  });
}

artwork.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const directory = path.join(process.cwd(), "cache");

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

fs.writeFileSync(
  path.join(directory, `output.json`),
  JSON.stringify({
    artwork,
    options,
  })
);
