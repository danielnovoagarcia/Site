(function () {
  const DOC_W_MM = 336.984;

  function updateGrid() {
    const page = document.querySelector('.page');
    if (!page) return;

    const widthPx = page.offsetWidth;
    const heightPx = window.innerHeight;
    const scale = widthPx / DOC_W_MM;
    const mmToPx = mm => mm * scale;
    const ptToPx = pt => (pt * 0.352778) * scale;

    const marginPx = mmToPx(5);
    const columnWidthPx = mmToPx(22.222);
    const gutterPx = mmToPx(3.175);
    const baselinePx = ptToPx(11);

    const marginPxRounded = Math.round(marginPx);
    const columnWidthPxRounded = Math.round(columnWidthPx);
    const gutterPxRounded = Math.round(gutterPx);
    const baselinePxRounded = Math.round(baselinePx);

    const root = document.documentElement;
    root.style.setProperty("--margin-px", `${marginPxRounded}px`);
    root.style.setProperty("--column-width-px", `${columnWidthPxRounded}px`);
    root.style.setProperty("--gutter-px", `${gutterPxRounded}px`);
    root.style.setProperty("--baseline-px", `${baselinePxRounded}px`);

    const textBlock = document.querySelector('.text-block');
    if (!textBlock) return;

    const textWidthPx = 3 * columnWidthPxRounded + 2 * gutterPxRounded;
    textBlock.style.width = `${textWidthPx}px`;
    textBlock.style.left = `${marginPxRounded}px`;
    textBlock.style.top = `0`;
    textBlock.style.bottom = `0`;
    textBlock.style.fontSize = `${baselinePxRounded}px`;
    textBlock.style.lineHeight = `${baselinePxRounded}px`;
    textBlock.style.fontFamily = 'Helvetica, Arial, sans-serif';
    textBlock.style.fontWeight = '500';
    textBlock.style.color = 'black';
    textBlock.style.overflowY = 'auto';
    textBlock.style.boxSizing = 'border-box';

    const baselineOffsetFromTop = measureBaselineOffset(baselinePxRounded, 'Helvetica, Arial, sans-serif');

    alignTextToGrid(textBlock, baselinePxRounded, marginPxRounded, baselineOffsetFromTop, heightPx);
  }

  function measureBaselineOffset(fontSize, fontFamily) {
    const tester = document.createElement('div');
    tester.style.position = 'absolute';
    tester.style.left = '-9999px';
    tester.style.top = '-9999px';
    tester.style.fontSize = `${fontSize}px`;
    tester.style.fontFamily = fontFamily;
    tester.style.lineHeight = `${fontSize}px`;
    tester.style.visibility = 'hidden';
    tester.style.whiteSpace = 'nowrap';

    const textSpan = document.createElement('span');
    textSpan.textContent = 'A';
    textSpan.style.display = 'inline-block';

    const refSpan = document.createElement('span');
    refSpan.style.display = 'inline-block';
    refSpan.style.width = '1px';
    refSpan.style.height = `${fontSize}px`;
    refSpan.style.verticalAlign = 'baseline';

    tester.appendChild(textSpan);
    tester.appendChild(refSpan);
    document.body.appendChild(tester);

    const textRect = textSpan.getBoundingClientRect();
    const refRect = refSpan.getBoundingClientRect();

    document.body.removeChild(tester);
    return Math.round(refRect.bottom - textRect.top);
  }

  function alignTextToGrid(textBlock, baselinePx, marginPx, baselineOffsetFromTop, pageHeight) {
    if (!textBlock.dataset.original) {
      textBlock.dataset.original = textBlock.innerHTML;
    }
    const originalHTML = textBlock.dataset.original;

    let inner = textBlock.querySelector('.text-inner');
    if (!inner) {
      inner = document.createElement('div');
      inner.className = 'text-inner';
      textBlock.innerHTML = '';
      textBlock.appendChild(inner);
    }

    const tmp = document.createElement('div');
    tmp.innerHTML = originalHTML;
    const paragraphs = Array.from(tmp.querySelectorAll('p'));
    inner.innerHTML = '';

    const maxWidth = textBlock.offsetWidth;

    const measureSpan = document.createElement('span');
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.position = 'absolute';
    measureSpan.style.left = '-99999px';
    measureSpan.style.top = '-99999px';
    measureSpan.style.whiteSpace = 'nowrap';
    const comp = window.getComputedStyle(textBlock);
    measureSpan.style.fontSize = comp.fontSize;
    measureSpan.style.fontFamily = comp.fontFamily;
    measureSpan.style.fontWeight = comp.fontWeight;
    document.body.appendChild(measureSpan);

    paragraphs.forEach((pNode) => {
      const p = document.createElement('p');
      p.style.margin = '0';
      p.style.padding = '0';

      if (pNode.innerHTML.includes('data-project')) {
        p.innerHTML = pNode.innerHTML;
        inner.appendChild(p);
        return;
      }

      const parts = pNode.innerHTML.split(/(<br\s*\/?>)/gi).filter(Boolean);
      let i = 0;

      while (i < parts.length) {
        if (/^<br\s*\/?>$/i.test(parts[i])) {
          let brCount = 0;
          while (i < parts.length && /^<br\s*\/?>$/i.test(parts[i])) {
            brCount++;
            i++;
          }
          const spacersToAdd = Math.max(0, brCount - 1);
          for (let s = 0; s < spacersToAdd; s++) {
            const spacer = document.createElement('div');
            spacer.className = 'para-spacer';
            spacer.style.height = `${baselinePx}px`;
            p.appendChild(spacer);
          }
          continue;
        }

        const textHtml = parts[i];
        const tmpSeg = document.createElement('div');
        tmpSeg.innerHTML = textHtml;
        let rawText = tmpSeg.textContent.replace(/\u00A0/g, ' ').trim();
        i++;

        if (!rawText) continue;

        const words = rawText.split(/\s+/);
        let line = '';

        for (let w = 0; w < words.length; w++) {
          const word = words[w];
          const test = line ? line + ' ' + word : word;
          measureSpan.textContent = test;
          const testWidth = measureSpan.offsetWidth;

          if (testWidth > maxWidth && line) {
            const span = document.createElement('span');
            span.className = 'line';
            span.style.display = 'block';
            span.style.height = `${baselinePx}px`;
            span.style.lineHeight = `${baselinePx}px`;
            span.textContent = line;
            p.appendChild(span);
            line = word;
          } else {
            line = test;
          }
        }

        if (line) {
          const span = document.createElement('span');
          span.className = 'line';
          span.style.display = 'block';
          span.style.height = `${baselinePx}px`;
          span.style.lineHeight = `${baselinePx}px`;
          span.textContent = line;
          p.appendChild(span);
        }
      }

      for (let b = 0; b < 2; b++) {
        const spacer = document.createElement('div');
        spacer.className = 'para-spacer';
        spacer.style.height = `${baselinePx}px`;
        p.appendChild(spacer);
      }

      inner.appendChild(p);
    });

    document.body.removeChild(measureSpan);

    const extraTopLines = 1;
    const paddingTop = marginPx + (extraTopLines * baselinePx) - baselineOffsetFromTop;
    inner.style.paddingTop = `${Math.round(paddingTop)}px`;

    const currentTotalHeight = inner.scrollHeight;
    const offsetFromBottomGrid = (currentTotalHeight - marginPx) % baselinePx;
    let paddingBottom = offsetFromBottomGrid === 0 ? 0 : baselinePx - offsetFromBottomGrid;
    paddingBottom = Math.round(paddingBottom);

    const paddingTopValue = parseFloat(inner.style.paddingTop) || 0;
    const contentHeightWithoutPadding = currentTotalHeight - paddingTopValue;

    if (contentHeightWithoutPadding + paddingTopValue + paddingBottom <= pageHeight) {
      const availableForContent = pageHeight - marginPx - paddingTopValue;
      const linesThatFit = Math.ceil(availableForContent / baselinePx);
      const idealContentHeight = linesThatFit * baselinePx;
      paddingBottom = Math.max(0, idealContentHeight - contentHeightWithoutPadding);
      paddingBottom = Math.round(paddingBottom);
    }

    inner.style.paddingBottom = `${paddingBottom}px`;
  }

  window.addEventListener('load', updateGrid);
  window.addEventListener('resize', updateGrid);
})();