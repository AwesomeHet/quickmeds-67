const AboutUs = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            About QuickMeds
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            QuickMeds is revolutionizing the pharmacy industry through innovative
            technology and a customer-first approach. Our mission is to make
            healthcare accessible, efficient, and reliable for communities
            nationwide.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Innovation
              </h3>
              <p className="text-gray-600">
                Cutting-edge technology for inventory and customer management
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">Quality</h3>
              <p className="text-gray-600">
                Highest standards in pharmaceutical care and service
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Community
              </h3>
              <p className="text-gray-600">
                Dedicated to serving and improving local healthcare
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;