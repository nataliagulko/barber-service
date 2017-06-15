<% import grails.persistence.Event %>
<%=packageName%>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="admin">
		<g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
                <g:set var="classTitle" value="\${message(code: '${domainClass.propertyName}')}" />
		<title><g:message code="\${classTitle}.show.label" default="[entityName]" /></title>
	</head>
	<body>
            <div id="show-${domainClass.propertyName}" class="scaffold">
                <div class="row">
                    <div class="col-md-12">
			<h1><g:message code="\${classTitle}.show.label" default="[entityName]" /></h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-7 form-horizontal ${domainClass.propertyName}">
                        <%  excludedProps = Event.allEvents.toList() << 'id' << 'version'
                                allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'
                                props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && (domainClass.constrainedProperties[it.name] ? domainClass.constrainedProperties[it.name].display : true) }
                                Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
                                props.each { p -> %>
                                <g:if test="\${${propertyName}?.${p.name}}">
                                    <div class="form-group">
                                            <label id="${p.name}-label" class="col-md-5 control-label"><g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" /></label>
                                            <%  if (p.isEnum()) { %>
                                                    <label class="col-md-7 form-control-static" aria-labelledby="${p.name}-label"><g:fieldValue bean="\${${propertyName}}" field="${p.name}"/></label>
                                            <%  } else if (p.oneToMany || p.manyToMany) { %>
                                                <label class="col-md-7 form-control-static">
                                                    <g:each in="\${${propertyName}.${p.name}}" var="${p.name[0]}">
                                                        <p><g:link controller="${p.referencedDomainClass?.propertyName}" action="show" id="\${${p.name[0]}.id}">\${${p.name[0]}?.encodeAsHTML()}</g:link></p>
                                                    </g:each>
                                                </label>
                                            <%  } else if (p.manyToOne || p.oneToOne) { %>
                                                    <label class="col-md-7 form-control-static" aria-labelledby="${p.name}-label"><g:link controller="${p.referencedDomainClass?.propertyName}" action="show" id="\${${propertyName}?.${p.name}?.id}">\${${propertyName}?.${p.name}?.encodeAsHTML()}</g:link></label>
                                            <%  } else if (p.type == Boolean || p.type == boolean) { %>
                                                    <label class="col-md-7 form-control-static" aria-labelledby="${p.name}-label"><g:formatBoolean boolean="\${${propertyName}?.${p.name}}" /></label>
                                            <%  } else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) { %>
                                                    <label class="col-md-7 form-control-static" aria-labelledby="${p.name}-label"><g:formatDate date="\${${propertyName}?.${p.name}}" /></label>
                                            <%  } else if (!p.type.isArray()) { %>
                                                    <label class="col-md-7 form-control-static" aria-labelledby="${p.name}-label"><g:fieldValue bean="\${${propertyName}}" field="${p.name}"/></label>
                                            <%  } %>
                                    </div>
                                </g:if>
                        <%  } %>

                            <g:form class="form-group" url="[resource:${propertyName}, action:'delete']" method="DELETE">
                                <label class="col-md-5 control-label"></label>
                                <div class="col-md-7">
                                        <g:link class="btn btn-primary" action="edit" resource="\${${propertyName}}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
                                        <g:link class="btn btn-default" action="index"><g:message code="default.button.back.label" args="[entityName]" /></g:link>
                                </div>
                            </g:form>
                    </div>
                    <div class="col-md-5"></div>
                </div>
            </div>
	</body>
</html>
