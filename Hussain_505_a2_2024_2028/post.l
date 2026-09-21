%{
#include<stdio.h>
#include "y.tab.h"
%}

%%
[0-9]+ {yylval = atoi(yytext); return NUMBER;}
[+*] {return yytext[0];}
[\t] { ;}

%%

int yywrap(){
	return ];
}
