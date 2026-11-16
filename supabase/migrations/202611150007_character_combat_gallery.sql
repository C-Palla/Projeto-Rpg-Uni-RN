insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'character-gallery',
  'character-gallery',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table public.character_gallery_images (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  filename text not null check (char_length(filename) between 1 and 120),
  content_type text not null check (content_type in ('image/png', 'image/jpeg', 'image/webp', 'image/gif')),
  created_at timestamptz not null default now()
);

create index character_gallery_images_owner_idx
  on public.character_gallery_images(owner_id, created_at desc);

alter table public.character_gallery_images enable row level security;

create policy "Owners and campaign members can read attached gallery images"
  on public.character_gallery_images for select to authenticated using (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.characters
      where characters.owner_id = character_gallery_images.owner_id
        and characters.campaign_id is not null
        and public.is_campaign_member(characters.campaign_id)
        and exists (
          select 1
          from jsonb_array_elements(
            case
              when jsonb_typeof(characters.fields -> 'Ataques') = 'array'
                then characters.fields -> 'Ataques'
              else '[]'::jsonb
            end
          ) as attacks(attack)
          where attacks.attack ->> 'imageId' = character_gallery_images.id::text
        )
    )
  );

create policy "Users can add their own gallery images"
  on public.character_gallery_images for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and split_part(storage_path, '/', 1) = (select auth.uid())::text
  );

create policy "Owners can delete their gallery images"
  on public.character_gallery_images for delete to authenticated
  using (owner_id = (select auth.uid()));

grant select, insert, delete on public.character_gallery_images to authenticated;

create policy "Users can upload to their own character gallery"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'character-gallery'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Authorized users can read character gallery images"
  on storage.objects for select to authenticated using (
    bucket_id = 'character-gallery'
    and exists (
      select 1
      from public.character_gallery_images
      where character_gallery_images.storage_path = objects.name
        and (storage.foldername(objects.name))[1] = character_gallery_images.owner_id::text
    )
  );

create policy "Owners can delete their character gallery images"
  on storage.objects for delete to authenticated using (
    bucket_id = 'character-gallery'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1
      from public.character_gallery_images
      where character_gallery_images.storage_path = objects.name
        and character_gallery_images.owner_id = (select auth.uid())
    )
  );
