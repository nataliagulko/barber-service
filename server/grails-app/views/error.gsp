<!DOCTYPE html>
<html>
    <head>
        <title><g:if env="development">Grails Runtime Exception</g:if><g:else>Error</g:else></title>
            <meta name="layout" content="main">
    <g:if env="development"><asset:stylesheet src="application.css"/></g:if>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12">

                <g:if env="development">
                    <g:renderException exception="${exception}" />
                </g:if>
                <g:else>
                    <ul class="errors">
                        <li>An error has occurred</li>
                    </ul>
                </g:else>
            </div>
        </div>
    </div>
</body>
</html>
