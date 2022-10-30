import {
  FC,
  PropsWithChildren,
  useMemo,
  Children,
  useState,
  useLayoutEffect,
  useRef,
  isValidElement,
  useCallback,
} from 'react';
import {
  WidthLimiterContainer,
  WidthLimiterLeftCounter,
  WidthLimiterNode,
  WidthLimiterNodeContainer,
} from './WidthLimiter.styles';

export interface WidthLimiterProps {
  leftCounterClassName?: string;
}

export const WidthLimiter: FC<PropsWithChildren<WidthLimiterProps>> = ({
  children,
  leftCounterClassName,
}) => {
  const mainContainerRef = useRef<HTMLDivElement>();
  const [leftNodesCounter, setLeftNodesCounter] = useState(0);

  const nodes = useMemo(
    () =>
      Children.toArray(children)
        .filter(isValidElement)
        .map((node) => (
          <WidthLimiterNode key={node.key}>{node}</WidthLimiterNode>
        )),
    [children],
  );

  const calculateWidth = useCallback(() => {
    if (!mainContainerRef.current) return;

    const mainContainerWidth = mainContainerRef.current.offsetWidth;
    const nodeContainer = mainContainerRef.current.firstChild;

    if (nodeContainer) {
      let nodesTotalWidth = 0;
      let displayedNodesCount = 0;

      Array.from(
        nodeContainer.childNodes as NodeListOf<HTMLDivElement>,
      ).forEach((node) => {
        nodesTotalWidth += node.offsetWidth;
        if (nodesTotalWidth <= mainContainerWidth - 100) {
          displayedNodesCount += 1;
          node.style.visibility = 'visible';
          node.style.opacity = '1';
        } else {
          node.style.visibility = 'hidden';
          node.style.opacity = '0';
        }
      });

      setLeftNodesCounter(nodes.length - displayedNodesCount);
    }
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', calculateWidth);
    calculateWidth();

    return () => {
      window.removeEventListener('resize', calculateWidth);
    };
  }, [calculateWidth]);

  return (
    <WidthLimiterContainer
      ref={mainContainerRef}
      data-testid="width-limiter-container"
    >
      <WidthLimiterNodeContainer data-testid="width-limiter-node-container">
        {nodes}
      </WidthLimiterNodeContainer>
      {leftNodesCounter > 0 && (
        <WidthLimiterLeftCounter
          className={leftCounterClassName}
          data-testid="width-limiter-left-counter"
        >
          +{leftNodesCounter}
        </WidthLimiterLeftCounter>
      )}
    </WidthLimiterContainer>
  );
};
