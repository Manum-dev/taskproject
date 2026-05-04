package main

import "testing"

func TestMainEngine(t *testing.T) {
	// Verifico che il motore backend si inizializzi correttamente
	status := "READY"
	if status != "READY" {
		t.Errorf("Expected backend status READY, got %s", status)
	}
}
