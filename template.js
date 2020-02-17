export default ({ markup, css }) => {
  return `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <title>STAN Me</title>	  	    
          <script src="/dist/js/jquery-3.2.1.slim.min.js"></script>
          <link rel="stylesheet" href="/dist/css/owl.carousel.min.css">
          <link rel="stylesheet" href="/dist/css/owl.theme.default.min.css">
          <link rel="stylesheet" href="/dist/css/cropper.css">
          <link rel="stylesheet" href="/dist/css/react-draft-wysiwyg.css">
          <script src="/dist/js/jquery.min.js"></script>
          <script src="/dist/js/owl.carousel.js"></script>
          <link rel="stylesheet" href="/dist/css/style.css">
          <link rel="stylesheet" href="/dist/css/style1.css">
          <link rel="stylesheet" href="/dist/css/style_custom.css">
          <link rel="stylesheet" href="/dist/fontawesome-pro-5/css/all.css">          
          <link rel="stylesheet" href="/dist/css/carousel_home.css">
          <script src="/dist/js/bootstrap.min.js"></script>
          <style>
              a{
                text-decoration: none;
              }
          </style>
          <script src="/dist/js/jquery-2.1.4.min.js"></script>
        <!---FAV Icons-->		  
		    <link rel="shortcut icon" type="image/x-icon" href="dist/stanme.ico">		
        <!-- FAV Icons END-->
        <!-- Global site tag (gtag.js) - Google Analytics 
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-143682828-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-143682828-1');
</script>
-->
        </head>
        <body style="margin:0px;box-sizing:border-box;">
          <div class="project-container" id="root">${markup}</div>
          <style id="jss-server-side">${css}</style>
          <script src="https://js.stripe.com/v3/"></script>
          <script type="text/javascript" src="/dist/bundle.js"></script>
        </body>
      </html>`;
}
