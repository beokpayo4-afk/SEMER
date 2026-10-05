import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { companyName } from "../utils/company.ts";

const description = "Read SEMER's product refund, return, replacement and cancellation policy for customer orders.";

export function ProductRefundReturnPolicyPage() {
  usePageTitle("Product Order Refund / Return Policy", {
    description,
    documentTitle: "Product Refund & Return Policy | SEMER",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl sm:text-5xl">Product Order Refund / Return Policy</h1>
      <p className="mt-6 text-sm text-muted">Effective Date: 05/10/2026</p>
      <p className="mt-6 leading-7">
        At SEMER, we want our customers to have a smooth shopping experience. If you receive a damaged, defective,
        incorrect, or eligible product, you may request a return, replacement, or refund according to the terms below.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl">1. Return Eligibility</h2>
        <p className="mt-3 leading-7">Products may be eligible for return if:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
          <li>The product is damaged or defective.</li>
          <li>The wrong product was delivered.</li>
          <li>The product is different from the product ordered.</li>
          <li>The product is marked as returnable on the product page.</li>
          <li>The return request is submitted within the applicable return period.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">2. Return Period</h2>
        <p className="mt-3 leading-7">Customers must submit a return request within 7 days of receiving the product.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">3. Damaged or Defective Product</h2>
        <p className="mt-3 leading-7">If you receive a damaged or defective product:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7">
          <li>Contact SEMER.</li>
          <li>Provide your order number.</li>
          <li>Provide photos/videos of the product and packaging.</li>
          <li>Our team will review the request.</li>
          <li>If approved, a replacement or eligible refund will be provided.</li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">4. Wrong Product</h2>
        <p className="mt-3 leading-7">If you receive the wrong product, contact us within the return period.</p>
        <p className="mt-3 leading-7">After verification, SEMER may provide a replacement or eligible refund.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">5. Product Condition</h2>
        <p className="mt-3 leading-7">Returned products should generally be:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
          <li>Unused</li>
          <li>In original packaging</li>
          <li>With original tags and accessories</li>
          <li>Accompanied by the invoice/order details</li>
        </ul>
        <p className="mt-3 leading-7">
          Products damaged or used by the customer may not qualify for return, subject to applicable law.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">6. Non-Returnable Products</h2>
        <p className="mt-3 leading-7">Some products may not be eligible for return, including products that are:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
          <li>Customized or personalized</li>
          <li>Used or damaged by the customer</li>
          <li>Missing original packaging or accessories</li>
          <li>Clearly marked as &quot;Non-Returnable&quot; on the product page</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">7. Refund</h2>
        <p className="mt-3 leading-7">
          Once a return is approved and the product is received/verified where required, the eligible refund will be
          processed.
        </p>
        <p className="mt-3 leading-7">Refunds will generally be made to the original payment method, where possible.</p>
        <p className="mt-3 leading-7">
          The time for the refund to appear in the customer&apos;s account may depend on the bank or payment provider.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">8. Replacement / Exchange</h2>
        <p className="mt-3 leading-7">Where available, SEMER may provide a replacement for the same product.</p>
        <p className="mt-3 leading-7">Replacement is subject to product availability and verification of the returned product.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">9. Order Cancellation</h2>
        <p className="mt-3 leading-7">Customers may request cancellation before the order is dispatched.</p>
        <p className="mt-3 leading-7">
          After dispatch, cancellation may not be possible and the customer may need to use the applicable return
          process.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">10. Return Shipping</h2>
        <p className="mt-3 leading-7">
          For an approved return caused by a damaged, defective, or incorrect product supplied by SEMER, SEMER may bear
          the applicable return shipping cost.
        </p>
        <p className="mt-3 leading-7">
          For other returns, return shipping charges may apply according to the product&apos;s return terms.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">11. COD Orders</h2>
        <p className="mt-3 leading-7">
          For eligible refunds on Cash on Delivery orders, customers may be required to provide valid bank/payment
          details for processing the refund.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">12. How to Request a Return</h2>
        <p className="mt-3 leading-7">Customers should provide:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
          <li>Order number</li>
          <li>Customer name</li>
          <li>Registered mobile number</li>
          <li>Email address</li>
          <li>Product name</li>
          <li>Reason for return</li>
          <li>Photos/videos, where applicable</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">13. Policy Changes</h2>
        <p className="mt-3 leading-7">
          SEMER may update this Product Order Refund / Return Policy from time to time. The latest version published on
          the website will apply to future orders, subject to applicable law.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">14. Contact Us</h2>
        <p className="mt-3 leading-7">SEMER</p>
        <p className="mt-3 leading-7">{companyName}</p>
        <p className="mt-3 leading-7">
          The site does not publish a separate support email, phone number, or street address. Send a return request
          from the <Link to="/contact" className="text-wine">contact page</Link>, including the details listed above.
        </p>
      </section>
    </article>
  );
}
