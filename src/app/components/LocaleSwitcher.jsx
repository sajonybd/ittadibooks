// src/app/components/LocaleSwitcher.jsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const toggleLocale = () => {
    const newLocale = currentLocale === 'en' ? 'bn' : 'en';
    // Replace the locale in the current path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex gap-1 items-center">
      <span>বাংলা</span>
      <input
        type="checkbox"
        className="toggle toggle-xs"
        onChange={toggleLocale}
        checked={currentLocale === 'en'}
      />
      <span>English</span>
    </div>
  );
}
