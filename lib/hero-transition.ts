type LinkActivation = {
  button: number;
  defaultPrevented: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

type LinkDestination = {
  target: string;
  download: boolean;
};

/** Keep modified clicks, downloads and explicit new-window targets native. */
export function shouldAnimateCourseLink(event: LinkActivation, link: LinkDestination, staticMode: boolean) {
  return !staticMode && !event.defaultPrevented && event.button === 0
    && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
    && !link.download && (!link.target || link.target.toLowerCase() === '_self');
}

/** Fit the original portrait into the viewport without changing its proportions. */
export function expandedPortraitFrame(viewportWidth: number, viewportHeight: number, aspectRatio: number) {
  const height = Math.min(viewportHeight * .88, viewportWidth * .92 / aspectRatio);
  const width = height * aspectRatio;
  return { left: (viewportWidth - width) / 2, top: viewportHeight - height, width, height };
}
