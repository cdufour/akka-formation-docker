#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int compute_cube(int n) {
	return n*n*n;
}

int main(int argc, char *argv[]) {
	// convertit l'argument de ligne de commande en entier
	int v = atoi(argv[1]);

	// calcule le cube de v
	int c = compute_cube(v);

	// alternative, utilisaition de la fn pow (math library)
	//int p = pow(v, 3);

	// affichage de c
	printf("%d", c);

	//printf("%d", p);

	return 0;
}
