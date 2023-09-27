import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { SearchForm } from '../model/SearchForm.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.scss'],
})
export class SearchMovieComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;

  minYear = 1900;
  maxYear = new Date().getFullYear();

  searchFormListener!: Subscription;

  constructor(private formbuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.formbuilder.group({
      infos: this.formbuilder.group(
        {
          id: [''],
          title: [''],
        },
        {
          validator: this.isRequiredValidator('title', 'id'),
        }
      ),
      type: ['serie'],
      releaseYear: [
        '',
        [
          Validators.required,
          this.rangeDateValidator(this.minYear, this.maxYear),
        ],
      ],
      sheet: [''],
    });

    this.searchFormListener = this.searchForm.valueChanges.subscribe(
      (value) => {
        console.log(value);
      }
    );

    this.searchForm.valueChanges.subscribe((value) => {
      console.log(value);
    });

    this.searchForm.patchValue({ sheet: 'courte' });
  }

  ngOnDestroy(): void {
    this.searchFormListener.unsubscribe();
  }

  submit() {
    const model: SearchForm = this.searchForm.value;
    console.log(JSON.stringify(model));
  }

  isRequiredValidator(title: string, id: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const idControl = control.get(id);
      const titleControl = control.get(title);

      if (idControl?.value || titleControl?.value) {
        return null;
      }

      return { isRequired: true };
    };
  }

  rangeDateValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const triggerYear = control.value;
      if (triggerYear >= min && triggerYear <= max) {
        return null;
      }
      return { min: { min, max } };
    };
  }
}
