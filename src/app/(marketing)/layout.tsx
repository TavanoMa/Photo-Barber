import Header from "@/src/components/HeaderLanding";
import FooterLanding from "@/src/components/FooterLanding";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">{children}</main>
      <FooterLanding />
    </div>
  );
}