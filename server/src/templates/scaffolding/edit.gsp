<%=packageName%>
<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="admin">
        <g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
        <g:set var="classTitle" value="\${message(code: '${domainClass.propertyName}')}" />
        <title><g:message code="\${classTitle}.edit.label" default="[entityName]" /></title>
    </head>
    <body>
        <div id="edit-${domainClass.propertyName}" class="scaffold">
            <div class="row">
                <div class="col-md-12">
                    <h1><g:message code="\${classTitle}.edit.label" default="[entityName]" /></h1>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <g:hasErrors bean="\${${propertyName}}">
                        <ul role="alert" class="alert alert-danger">
                            <g:eachError bean="\${${propertyName}}" var="error">
                                <li <g:if test="\${error in org.springframework.validation.FieldError}">data-field-id="\${error.field}"</g:if>><g:message error="\${error}"/></li>
                            </g:eachError>
                        </ul>
                    </g:hasErrors>
                </div>
                <div class="col-md-6"></div>
            </div>
            <div class="row">
                <div class="col-md-7">
                    <g:form class="form-horizontal" url="[resource:${propertyName}, action:'update']" method="PUT" <%= multiPart ? ' enctype="multipart/form-data"' : '' %>>
                        <g:hiddenField name="version" value="\${${propertyName}?.version}" />
                        <fieldset>
                            <g:render template="form"/>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <div class="col-md-5"></div>
                                <div class="col-md-7">
                                    <g:actionSubmit class="btn btn-primary" action="update" value="\${message(code: 'default.button.update.label', default: 'Update')}" />
                                    <g:link class="btn btn-default" action="index"><g:message code="default.button.back.label" args="[entityName]" /></g:link>
                                </div>
                            </div>
                        </fieldset>
                    </g:form>
                </div>
                <div class="col-md-5"></div>
            </div>
        </div>
    </body>
</html>
