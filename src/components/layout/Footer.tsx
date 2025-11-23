"use client";


export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ApexStream. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Privacy Policy</p>
            <p className="text-sm text-muted-foreground">Terms of Service</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
