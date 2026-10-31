module.exports={images:{remotePatterns:[{protocol:'https',hostname:'**.public.blob.vercel-storage.com'},{protocol:'https',hostname:'m.media-amazon.com'}]},
async rewrites(){return[{source:'/produtos/:c',destination:'/produtos?c=:c'},{source:'/receitas/:r',destination:'/receita?r=:r'}];}};
