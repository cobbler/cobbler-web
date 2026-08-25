import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  Routes,
  withRouterConfig,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({ selector: 'cobbler-test-stub', template: '' })
class StubComponent {}

/**
 * Mirrors the app's real system/:name/interface/... nesting shape (see app-routing.module.ts):
 * a `:name` segment, followed by a non-empty `interface` shell segment (a real component, no
 * params of its own), followed by both an empty-path overview child and a non-empty `:interface`
 * edit child. Every level has its own component, exactly like the real routes.
 */
const NESTED_ROUTES: Routes = [
  {
    path: 'system',
    component: StubComponent,
    children: [
      {
        path: ':name',
        component: StubComponent,
        children: [
          { path: '', component: StubComponent },
          {
            path: 'interface',
            component: StubComponent,
            children: [
              { path: '', component: StubComponent },
              { path: ':interface', component: StubComponent },
            ],
          },
        ],
      },
    ],
  },
];

describe('paramsInheritanceStrategy for nested item/sub-item routes', () => {
  it('leaves `name` undefined on the interface routes with the Angular default ("emptyOnly")', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(NESTED_ROUTES)],
    });
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);

    await harness.navigateByUrl('/system/testsystem/interface');
    expect(
      router.routerState.snapshot.root.firstChild?.firstChild?.firstChild?.firstChild?.paramMap.get(
        'name',
      ),
    ).toBeNull();

    await harness.navigateByUrl('/system/testsystem/interface/eth0');
    expect(
      router.routerState.snapshot.root.firstChild?.firstChild?.firstChild?.firstChild?.paramMap.get(
        'name',
      ),
    ).toBeNull();
  });

  it('merges `name` down through the interface shell into both interface routes with "always"', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          NESTED_ROUTES,
          withRouterConfig({ paramsInheritanceStrategy: 'always' }),
        ),
      ],
    });
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);

    await harness.navigateByUrl('/system/testsystem/interface');
    const overviewParams =
      router.routerState.snapshot.root.firstChild?.firstChild?.firstChild
        ?.firstChild?.paramMap;
    expect(overviewParams?.get('name')).toEqual('testsystem');

    await harness.navigateByUrl('/system/testsystem/interface/eth0');
    const editParams =
      router.routerState.snapshot.root.firstChild?.firstChild?.firstChild
        ?.firstChild?.paramMap;
    expect(editParams?.get('name')).toEqual('testsystem');
    expect(editParams?.get('interface')).toEqual('eth0');
  });
});
