const urls = {
  //backendUrl:"http://51.20.165.45"
  backendUrl: "https://api.chatg6.ai",
  verif:"http://localhost:3000/authentication/verification",
};

const endpoints = {
  literature: "literature/",
  documentation: "documentation/",
  plagiarism: "plagiarism/",
  article: "article/",
  outline: "outline/",
  arxiv_search:"https://export.arxiv.org/api/query",
  archive_search:"https://archive.org/advancedsearch.php",
  archive_metadata:"https://archive.org/metadata",
  semantic_search:"https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,year,authors,openAccessPdf,abstract",
  plg_record:"https://localhost:3000/api/utils/record",
  expired:'http://localhost:3000/api/utils/expired',
  login:'http://localhost:3000/api/auth/login',
  verify_endpoint:'http://localhost:3000/api/auth/verify'
};

const URLS = {
  urls: urls,
  endpoints: endpoints,
};

export default URLS;
