"use client";

const linkClass =
  "hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors";

export function Footer() {
  const contactLinks = [
    {
      label: "Email",
      href: process.env.NEXT_PUBLIC_CONTACT_EMAIL
        ? `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`
        : null,
    },
    {
      label: "X (Twitter)",
      href: process.env.NEXT_PUBLIC_TWITTER_URL || null,
    },
    {
      label: "Instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
    },
    {
      label: "Indie Hackers",
      href: process.env.NEXT_PUBLIC_INDIEHACKERS_URL || null,
    },
  ].filter((l): l is { label: string; href: string } => !!l.href);

  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;

  return (
    <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              ImageTools
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Free image utilities for compression, resizing, format conversion,
              and more. No installation required — all tools run in your browser.
            </p>
          </div>
          {contactLinks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Contact
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Questions or feedback?
              </p>
              <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={linkClass}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="sm:col-span-2">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              About
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Built for developers who need quick, reliable image tools. 
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              No sign-up, no tracking, no installation. 
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              All processing happens locally in your browser.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 text-center text-sm text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} ImageTools. All tools are free to use.
            {githubUrl && (
              <>
                {" · "}
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  GitHub
                </a>
              </>
            )}
        </div>
      </div>
    </footer>
  );
}
