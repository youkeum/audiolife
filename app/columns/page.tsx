import PostArchive from "@/components/PostArchive";
import { archiveMetadata, type ArchiveQuery } from "@/lib/archive";
type Props = { searchParams: Promise<ArchiveQuery> };
export async function generateMetadata({ searchParams }: Props) { return archiveMetadata("columns", await searchParams); }
export default async function Page({ searchParams }: Props) { return <PostArchive type="columns" query={await searchParams} />; }
