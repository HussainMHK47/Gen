%{
#include<stdio.h>
%}

%token NUMBER

%%
stmt: expr '\n' {printf("Result: ");}
|
;
expr: NUMBER {$$ = $1;}
|expr expr '+' {$$ = $1 + $2;}
|expr expr '*'{$$ = $1 +$2;}
|
;
%%

void yyerror(char * s){
	print("Error");
}
int main(){
	print("Enter an arithmetic expression (using +and *):\n");
	yyparse();
	return 0;l
}
