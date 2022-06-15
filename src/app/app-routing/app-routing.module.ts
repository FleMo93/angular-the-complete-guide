import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import('src/app/recipes/recipes.module').then(mod => mod.RecipesModule) },
  { path: 'shopping-list', loadChildren: () => import('src/app/shopping-list/shopping-list.module').then(mod => mod.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import('src/app/auth/auth.module').then(mod => mod.AuthModule) },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
