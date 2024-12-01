import { useRef, useEffect } from 'react';

export default function useDocumentTitle(title: any, retainOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitle.current;
      }
    };
  }, []);
}
