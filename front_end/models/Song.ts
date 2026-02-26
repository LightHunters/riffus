import { Model, Schema, model, models } from "mongoose";

export type SongSource = "local" | "deezer" | "itunes";

export type SongDocument = {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage: string;
  category?: string;
  playCount: number;
  lastPlayed?: Date;
  previewUrl?: string;
  source: SongSource;
  deezerId?: number;
  itunesTrackId?: number;
  createdAt: Date;
  updatedAt: Date;
};

const SongSchema = new Schema<SongDocument>(
  {
    title: { type: String, required: true, trim: true, index: true },
    artist: { type: String, required: true, trim: true, index: true },
    album: { type: String, trim: true, default: "", index: true },
    coverImage: { type: String, required: true },
    category: { type: String, default: "general" },
    playCount: { type: Number, default: 0 },
    lastPlayed: { type: Date },
    previewUrl: { type: String, default: "" },
    source: {
      type: String,
      enum: ["local", "deezer", "itunes"],
      default: "local",
      index: true,
    },
    deezerId: { type: Number, sparse: true, unique: true },
    itunesTrackId: { type: Number, sparse: true, unique: true },
  },
  { timestamps: true },
);

SongSchema.index({ title: "text", artist: "text", album: "text" });

export const SongModel: Model<SongDocument> =
  models.Song || model<SongDocument>("Song", SongSchema);
