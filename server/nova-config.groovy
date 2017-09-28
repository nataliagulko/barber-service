dataSource.dbCreate="update"

dataSource.driverClassName="com.mysql.jdbc.Driver"

//dataSource.url="jdbc:mysql://localhost:3306/barber"

dataSource.username="root"

dataSource.password="00000"

logSql = true

environments {
    
  development {
       
    dataSource {
            
        dbCreate = "update" // one of 'create','create-drop', 'update', 'validate', ''
            
        url = "jdbc:mysql://localhost:3306/barber"
        
    }
    
  }

}