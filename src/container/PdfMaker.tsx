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
var pdfFonts = require('./vfs_NotoSansCJKjp_2_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  NotoSans: {
    normal: 'NotoSansCJKjp-Regular.otf',
    bold: 'NotoSansCJKjp-Bold.otf',
    italics: 'NotoSansCJKjp-Thin.otf',
    bolditalics: 'NotoSansCJKjp-Black.otf'
  },
};
const PdfMaker:React.FC = () => {
  const [url, setUrl] = React.useState('')

  React.useEffect(() => {
    a()
  }, []);

  const a = () => {
    
    var win = window.open('', '_blank');
    pdfMake.createPdf({
        content: [
          {text: '1 Headline', headlineLevel: 1},
          'あいうえおかきくけこさしすせそ',
          '別の段落、今回はのためにもう少し長く、この行は少なくとも2行にされます別の段落',
          '別の段落、今回はのためにもう少し長く、この行は少なくとも2行にされます'
        ],
        defaultStyle: {
          font: 'NotoSans',
        },
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
