import BlogContent from "@/components/sections/BlogContent";
import RelatedArticles from "@/components/sections/RelatedArticles";

export default function BlogDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    return (
        <main className="pt-20 pb-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Main Content (8 columns on desktop) */}
                    <div className="lg:col-span-8">
                        <BlogContent />
                    </div>

                    {/* Sidebar (4 columns on desktop) */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <RelatedArticles />
                    </div>
                </div>
            </div>
        </main>
    );
}