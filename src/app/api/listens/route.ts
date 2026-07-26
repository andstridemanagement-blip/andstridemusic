import { geolocation } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "../../../lib/supabase-admin";

export const dynamic = "force-dynamic";

type ListenRequestBody = {
  trackSlug?: string;
  trackTitle?: string;
};

export async function GET() {
  const since = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabaseAdmin
    .from("listen_events")
    .select(
      "id, track_slug, track_title, city, country, latitude, longitude, created_at"
    )
    .gte("created_at", since)
    .order("created_at", {
      ascending: false,
    })
    .limit(150);

  if (error) {
    console.error("Unable to load listen events:", error);

    return NextResponse.json(
      {
        events: [],
        error: "Unable to load listen events.",
        supabaseCode: error.code,
        supabaseMessage: error.message,
        supabaseDetails: error.details,
        supabaseHint: error.hint,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    events: data ?? [],
  });
}

export async function POST(request: NextRequest) {
  let body: ListenRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }

  const trackSlug = body.trackSlug?.trim();
  const trackTitle = body.trackTitle?.trim();

  if (!trackSlug || !trackTitle) {
    return NextResponse.json(
      {
        error: "Track information is required.",
      },
      {
        status: 400,
      }
    );
  }

  const geo = geolocation(request);

  const latitude = Number(geo.latitude);
  const longitude = Number(geo.longitude);

  const hasValidCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const listenEvent = {
    track_slug: trackSlug,
    track_title: trackTitle,

    city:
      geo.city ||
      (process.env.NODE_ENV === "development"
        ? "Petropavl"
        : "Unknown"),

    country:
      geo.country ||
      (process.env.NODE_ENV === "development"
        ? "KZ"
        : "Unknown"),

    latitude: hasValidCoordinates
      ? latitude
      : 54.8728,

    longitude: hasValidCoordinates
      ? longitude
      : 69.143,
  };

  const { error } = await supabaseAdmin
    .from("listen_events")
    .insert(listenEvent);

  if (error) {
    console.error("Unable to save listen event:", error);

    return NextResponse.json(
      {
        error: "Unable to save listen event.",
        supabaseCode: error.code,
        supabaseMessage: error.message,
        supabaseDetails: error.details,
        supabaseHint: error.hint,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
    },
    {
      status: 201,
    }
  );
}