import { debounce } from 'lodash';
import React, {
  Children,
  FC,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import Typography from '../typography';
import style from './style.module.scss';

type WidthLimiterProps = {
  totalCount: number;
};

const WidthLimiter: FC<WidthLimiterProps> = ({ children, totalCount }) => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [itemsLeft, setItemsLeft] = useState(0);

  const childrenDivs = useMemo(
    () =>
      Children.toArray(children)
        .filter(isValidElement)
        .map((child) => (
          <div
            style={{ opacity: '0', visibility: 'hidden' }}
            data-count={
              child.props &&
              typeof child.props === 'object' &&
              'data-count' in child.props
                ? (child.props as { 'data-count'?: string })['data-count']
                : ''
            }
          >
            {child}
          </div>
        )),
    [children]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateLimit = useCallback(
    debounce(() => {
      if (!mainContainerRef.current) return;

      const mainContainerWidth = mainContainerRef.current.offsetWidth - 100;
      const childrenContainer = mainContainerRef.current.querySelector('div');

      if (childrenContainer) {
        let itemsWidthSum = 0;
        let renderedItems = 0;

        Array.from(
          childrenContainer.childNodes as NodeListOf<HTMLDivElement>
        ).forEach((child) => {
          itemsWidthSum += child.offsetWidth;
          /* eslint-disable no-param-reassign */
          if (itemsWidthSum < mainContainerWidth) {
            child.style.opacity = '1';
            child.style.visibility = 'visible';
            child.style.display = 'block';

            const dataCount = child?.getAttribute('data-count');
            renderedItems += dataCount ? parseInt(dataCount, 10) : 1;
          } else {
            child.style.display = 'none';
          }
        });

        setItemsLeft(totalCount - renderedItems);
      }
    }, 750),
    [totalCount, childrenDivs]
  );

  useLayoutEffect(() => {
    window.addEventListener('resize', calculateLimit);
    calculateLimit();

    return () => {
      window.removeEventListener('resize', calculateLimit);
    };
  }, [calculateLimit]);

  return (
    <div className={style.mainContainer} ref={mainContainerRef}>
      <div className={style.childrenContainer}>{childrenDivs}</div>
      {Boolean(itemsLeft > 0) && (
        <Typography
          color="primary-500"
          variant="text-m-regular"
          className={style.leftCounter}
        >
          +{itemsLeft}
        </Typography>
      )}
    </div>
  );
};

export default WidthLimiter;
