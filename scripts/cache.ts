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
  id: string;
  title: string;
  description: string;
  artist: string;
  date: string;
  image: string;
  drop: string;
};

export type Artist = {
  id: string;
  name: string;
  image: string;
  link: string;
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

for (const { id, properties } of fetchArtwork.results as any) {
  const { Title, Artist, Description, Date, Drop, Image } = properties;

  artwork.push({
    id,
    title: Title.title[0].plain_text,
    artist: Artist.relation[0].id,
    description: Description.rich_text[0].plain_text,
    date: Date.date.start,
    drop: Drop.url,
    image: Image.url,
  });
}

artwork.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const fetchArtists = await notion.databases.query({
  database_id: "beaf7f0bd17c49e0bdd8e5f02733bc88",
});

const artists: Artist[] = [];

for (const { id, properties } of fetchArtists.results as any) {
  const { Name, Image, Link } = properties;

  artists.push({
    id,
    name: Name.title[0].plain_text,
    image: Image.url,
    link: Link.url,
  });
}

const directory = path.join(process.cwd(), "cache");

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

fs.writeFileSync(
  path.join(directory, `output.json`),
  JSON.stringify({
    artwork,
    artists,
    options,
  })
);
