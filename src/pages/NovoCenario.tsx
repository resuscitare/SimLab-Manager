<Badge
                  variant={activeTab === tab.value ? "default" : tab.status === "ativo" ? "default" : "secondary"}
                  className={`cursor-pointer ${
                    activeTab === tab.value ? "bg-primary" : 
                    tab.status === "ativo" ? "bg-green-500" : ""
                  }`}
                  onClick={() => handleTabChange(tab.value)}
                >
                  {tab.label}
                </Badge>