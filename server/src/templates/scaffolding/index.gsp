<% import grails.persistence.Event %>
<%=packageName%>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="admin">
		<g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
                <g:set var="classTitle" value="\${message(code: '${domainClass.propertyName}')}" />
		<title><g:message code="\${classTitle}.list.label" default="[entityName]" /></title>
	</head>
	<body>
                <div id="list-${domainClass.propertyName}" class="scaffold">
                    <div class="row">
                        <div class="col-md-8">
                            <h1><g:message code="\${classTitle}.list.label" default="[entityName]" /></h1>
                        </div>
                        <div class="col-md-4 text-right scaffold__header-controls">
                            <g:link class="btn btn-primary" action="create"><g:message code="\${classTitle}.new.label" default="[entityName]" /></g:link>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table">
                            <thead>
                                            <tr>
                                            <%  excludedProps = Event.allEvents.toList() << 'id' << 'version'
                                                    allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'
                                                    props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && it.type != null && !Collection.isAssignableFrom(it.type) && (domainClass.constrainedProperties[it.name] ? domainClass.constrainedProperties[it.name].display : true) }
                                                    Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
                                                    props.eachWithIndex { p, i ->
                                                            if (i < 6) {
                                                                    if (p.isAssociation()) { %>
                                                    <th><g:message code="${domainClass.propertyName}.${p.name}.label" default="${p.naturalName}" /></th>
                                            <%      } else { %>
                                                    <g:sortableColumn property="${p.name}" title="\${message(code: '${domainClass.propertyName}.${p.name}.label', default: '${p.naturalName}')}" />
                                            <%  }   }   } %>
                                                    <th class="table__controls"></th>
                                            </tr>
                                    </thead>
                                    <tbody>
                                    <g:each in="\${${propertyName}List}" status="i" var="${propertyName}">
                                            <tr class="\${(i % 2) == 0 ? 'even' : 'odd'}">
                                            <%  props.eachWithIndex { p, i ->
                                                            if (i == 0) { %>
                                                    <td><g:link action="show" id="\${${propertyName}.id}">\${fieldValue(bean: ${propertyName}, field: "${p.name}")}</g:link></td>
                                            <%      } else if (i < 6) {
                                                                    if (p.type == Boolean || p.type == boolean) { %>
                                                    <td><g:formatBoolean boolean="\${${propertyName}.${p.name}}" /></td>
                                            <%          } else if (p.type == Date || p.type == java.sql.Date || p.type == java.sql.Time || p.type == Calendar) { %>
                                                    <td><g:formatDate date="\${${propertyName}.${p.name}}" /></td>
                                            <%          } else { %>
                                                    <td>\${fieldValue(bean: ${propertyName}, field: "${p.name}")}</td>
                                            <%  }   }   } %>
                                            <td class="table__controls text-right">
                                                <g:link class="table__item table__item_edit text-info" action="edit" resource="\${${propertyName}}">
                                                    <i class="glyphicon glyphicon-pencil"></i>
                                                </g:link>
                                                <g:link class="table__item table__item_delete text-danger" action="delete" resource="\${${propertyName}}">
                                                    <i class="glyphicon glyphicon-trash "></i>
                                                </g:link>
                                            </td>
                                            </tr>
                                    </g:each>
                                    </tbody>
                            </table>
                            <div>
                                    <g:paginate total="\${${propertyName}Count ?: 0}" />
                            </div>
                        </div>
                    </div>
		</div>
	</body>
</html>
