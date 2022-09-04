/* eslint-disable */

export const annotationsPlugin = (opts: any, from: any, to: any) => {
  let xMarks = [
    {
      type: "eqk",
      from,
      to
    }
  ];

  const placeMark = (u: uPlot, mark: any, opts: any) => {
    let markEl = document.createElement("div");
    markEl.classList.add("u-mark-x");

    let leftCss = Math.round(u.valToPos(mark.from, "x"));
    let widthCss =
      mark.to > mark.from ? Math.round(u.valToPos(mark.to, "x")) - leftCss : 0;

    Object.assign(markEl.style, {
      left: `${leftCss}px`,
      width: `${widthCss}px`,
      borderLeft: `${opts.width}px ${opts.dash ? "dashed" : "solid"} ${opts.stroke}`,
      background: opts.fill,
      opacity: 0.5
    });

    let labelEl = document.createElement("div");
    labelEl.classList.add("u-mark-x-label");
    labelEl.textContent = mark.label;

    markEl.appendChild(labelEl);
    u.over.appendChild(markEl);
  };

  return {
    hooks: {
      drawClear: [
        (u) => {
          for (let el of u.over.querySelectorAll(".u-mark-x")) el.remove();

          xMarks.forEach((mark) => {
            let o = opts.types[mark.type];

            if (
              (mark.from >= u.scales.x.min && mark.from <= u.scales.x.max) ||
              (mark.to >= u.scales.x.min && mark.to <= u.scales.x.max) ||
              (mark.from <= u.scales.x.min && mark.to >= u.scales.x.max)
            ) {
              placeMark(u, mark, o);
            }
          });
        }
      ]
    }
  };
};
