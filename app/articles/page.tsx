import PostArchive from "@/components/PostArchive";
import { archiveMetadata, type ArchiveQuery } from "@/lib/archive";
type Props = { searchParams: ArchiveQuery };
export function generateMetadata({ searchParams }: Props) { return archiveMetadata("articles", searchParams); }
export default function Page({ searchParams }: Props) { return <PostArchive type="articles" query={searchParams} />; }
