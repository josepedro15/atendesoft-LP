interface BlogHeroProps {
  latestPost?: any;
}

const BlogHero = ({ latestPost }: BlogHeroProps) => {
  return (
    <>
      <style jsx>{`
        .blog-hero h1,
        .blog-hero p {
          color: white !important;
        }
      `}</style>
      <section className="blog-hero bg-gradient-to-r from-primary to-primary/80 py-12 sm:py-16 pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Blog AtendeSoft
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 leading-relaxed">
              Descubra as últimas tendências em automação comercial, inteligência artificial e transformação digital
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogHero;