import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceitaCardComponent } from './receita-card.component';

describe('ReceitaCardComponent', () => {
  let component: ReceitaCardComponent;
  let fixture: ComponentFixture<ReceitaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceitaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceitaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
