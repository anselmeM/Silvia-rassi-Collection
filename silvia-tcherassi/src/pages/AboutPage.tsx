export default function AboutPage() {
  return (
    <div>
      <section className="text-center pt-12 pb-8">
        <h1 className="text-6xl font-serif">Inside Out</h1>
        <p className="mt-4 max-w-3xl mx-auto text-sm text-gray-600">
          Silvia Tcherassi is not merely a brand; it is a declaration of intent. It is the belief
          that style is a form of self-expression, and that elegance is found in the confidence of
          the wearer.
        </p>
      </section>

      <section className="px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img
          alt="A person sewing in a workshop"
          className="w-full h-auto object-cover object-center rounded-lg"
          src="/images/ladyInBlack.png"
          loading="lazy"
        />
        <div>
          <h2 className="text-4xl font-serif mb-4">An Artisanal Love Affair</h2>
          <p className="text-gray-700 leading-relaxed">
            Our collections are born from a dialogue between the designer's vision and the artisan's
            hand. We champion traditional techniques, reinterpreting them for the modern woman.
            Each piece is a testament to the skill, patience, and dedication of our craftspeople.
          </p>
        </div>
      </section>
    </div>
  );
}
