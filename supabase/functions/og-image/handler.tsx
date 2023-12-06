import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from 'https://deno.land/x/og_edge/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STORAGE_URL = "https://avidqeahkxhlijohpfjx.supabase.co/storage/v1/object/public/edgy-edge/edgy-images/"

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get('name') || 'World';

  const storageRes = await fetch(`${STORAGE_URL}${name}.png`);
  if (storageRes.ok) return storageRes;

  const generatedImage =  new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 128,
          background: 'lavender',
        }}
      >
        Hello {name}!
      </div>
    )
  )

  //upload to supabase storage
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? "https://avidqeahkxhlijohpfjx.supabase.co",
    Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2aWRxZWFoa3hobGlqb2hwZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4NTMzNjQsImV4cCI6MjAxNzQyOTM2NH0.lsPZ8vpKO1Wh8QUpAfrwprnYVmWwca9f38FmaWmwOy8'
  )

const { data, error } = await supabaseAdmin
  .storage
  .from('edgy-edge')
  .upload(`edgy-images/${name}.png`, generatedImage.body!, {
    cacheControl: '3600',
    upsert: false
  });
  console.log(data, error);

   return generatedImage;
}