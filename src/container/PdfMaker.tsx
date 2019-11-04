import React from 'react'

var pdfMake = require('pdfmake/build/pdfmake.js');

/**
 * CUSTOM FONTS (CLIENT-SIDE)
 * https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/
 * https://qiita.com/kspotfujita/items/d47666733121eb76fe5b
 * 
 * \node_modules\pdfmake\examples\fonts にフォントを置く
 * \node_modules\pdfmake で gulp buildFonts
 * \node_modules\pdfmake\build\vfs_fonts.js が生成される
 */

var pdfFonts = require('./vfs_FlopDesignFONT_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  FlopDesignFONT: {
    normal: 'FlopDesignFONT.otf'
  },
};

const PdfMaker:React.FC = () => {
  const [url, setUrl] = React.useState('')

  React.useEffect(() => {
    a()
  }, []);

  const w = 780
  const h = 530

  const a = () => {
    
    var win = window.open('', '_blank');
    pdfMake.createPdf({
        content: [
          { svg: `<svg width="780" height="530" font-family="FlopDesignFONT" font-size="8">
              <g width="${w}" height="${h}" >
                <g transform="translate(${w / 4},${h / 2}) rotate(180)">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="12">1 本日は晴天なり</text>
                </g>
                <g transform="translate(${w / 2},${h / 2}) rotate(180)">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="12">2</text>
                </g>
                <g transform="translate(${w / 4 * 3},${h / 2}) rotate(180)">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="12">3</text>
                </g>
                <g transform="translate(${w / 4 * 4},${h / 2}) rotate(180)">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="12">${w / 4}</text>
                </g>
                <g x="0" y="0" transform="translate(0,${h / 2})">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="12">5</text>
                </g>
                <g x="0" y="0" transform="translate(${w / 4},${h / 2})">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="16" font-weight="bold" font-size="16">June Yamamoto 's</text>
                </g>
                <g x="0" y="0" transform="translate(${w / 4 * 2},${h / 2})">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="12">7</text>
                </g>
                <g x="0" y="0" transform="translate(${w / 4 * 3},${h / 2})">
                  <rect x="0" y="0" width="${w / 4}" height="${h / 2}" stroke="lightgray" stroke-width="1" fill="none"/>
                  <text x="0" y="12">8</text>
                </g>
                <rect x="0" y="0" width="5" height="5" />
                <rect x="775" y="0" width="5" height="5" />
                <rect x="775" y="${h - 5}" width="5" height="5" />
                <rect x="0" y="${h - 5}" width="5" height="5" />
              </g>
            </svg>`
          }
        ],
        defaultStyle: {
          font: 'FlopDesignFONT',
        },
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [ 30, 30, 30, 30 ],
        compress: false,
        fontLayoutCache: false,
        bufferPages: true
    }).open({}, win);

   /*
    const pdfDocGenerator = pdfMake.createPdf({
      content: [
        'あいうえお',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
      ],
      defaultStyle: {
        font: 'NotoSans',
      },
    });
    pdfDocGenerator.getDataUrl((url:string) => {
      setUrl(url)
    })
    */
  }

  return (
      <div>
          {url &&<a href={url}>URL</a>}
      </div>
  )
}

export default PdfMaker
